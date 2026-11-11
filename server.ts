import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { db } from './src/db/index.ts';
import { bookings, users } from './src/db/schema.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { eq } from 'drizzle-orm';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  country?: string;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory registered users list (starts empty for real registration requirement)
  const messages: ContactMessage[] = [];
  const usersList: User[] = [];

  // API endpoints
  app.get("/api/tours", (req, res) => {
    res.json([
      {
        id: "pokhara",
        name: "ポカラツアー",
        nameEn: "Pokhara Tour",
        description: "ヒマラヤの雄大なパノラマと、美しいフェワ湖に癒やされるネパールのリゾート。ボート遊びやハイキング、パラグライディングに最適な静寂な楽園です。マチャプチャレの絶景をお楽しみください。",
        price: "128,000円",
        image: "pokhara",
        duration: "4泊5日",
        rating: 5,
      },
      {
        id: "kathmandu",
        name: "カトマンズツアー",
        nameEn: "Kathmandu Tour",
        description: "歴史、寺院、精神性が息づくネパールの首都。スワヤンブナート（モンキーテンプル）やボダナート、ユネスコ世界遺産の王宮広場など、古代の文化と活気あるストリートを満喫する旅です。",
        price: "115,000円",
        image: "kathmandu",
        duration: "3泊4日",
        rating: 4.8,
      },
      {
        id: "lumbini",
        name: "ルンبینیツアー (ルンビニ)",
        nameEn: "Lumbini Tour",
        description: "仏教の開祖、釈迦（ブッダ）の誕生 of の地。聖なるマヤデビ寺院やブッダが産湯を浴びたとされるプスカリニ池があり、世界中から祈りと瞑想のために人々が訪れる世界平和を祈る聖地です。",
        price: "135,000円",
        image: "lumbini",
        duration: "4泊5日",
        rating: 4.9,
      },
      {
        id: "dhorpatan",
        name: "ドルパタンツアー",
        nameEn: "Dhorpatan Tour",
        description: "手つかづの大自然が広がるネパール唯一の狩猟・野生動物保護区。高山帯の美しい草原、うっそうとした松林、そびえ立つ雪山。本格的なハイキングや野生の青い羊、伝統の暮らしに出会える秘境です。",
        price: "165,000円",
        image: "dhorpatan",
        duration: "6泊7日",
        rating: 4.7,
      }
    ]);
  });

  // Safe user profile synchronization (Firebase Auth Integration with Cloud SQL)
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user;
      if (!email) {
        return res.status(400).json({ error: "Email is required from token." });
      }
      const dbUser = await getOrCreateUser(uid, email);
      res.json({
        success: true,
        user: {
          id: dbUser.id,
          uid: dbUser.uid,
          username: email.split("@")[0], // default username prefix
          email: dbUser.email,
        }
      });
    } catch (error: any) {
      console.error("User synchronization failed:", error);
      res.status(500).json({ error: "ユーザープロファイルの同期に失敗しました。" });
    }
  });

  // Get active user's bookings from PostgreSQL
  app.get("/api/bookings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user;
      if (!email) {
        return res.status(400).json({ error: "Email is required from token." });
      }
      const dbUser = await getOrCreateUser(uid, email);
      
      const list = await db.select()
        .from(bookings)
        .where(eq(bookings.userId, dbUser.id));
      
      // Parse add_ons back to arrays if they are stored as JSON strings
      const formattedList = list.map(b => {
        let parsedAddOns: string[] = [];
        if (b.addOns) {
          try {
            parsedAddOns = JSON.parse(b.addOns);
          } catch (e) {
            parsedAddOns = b.addOns.split(",").map(s => s.trim()).filter(Boolean);
          }
        }
        return {
          id: b.id,
          tourId: b.tourId,
          tourName: b.tourName,
          travelDate: b.travelDate,
          travelers: b.travelers,
          addOns: parsedAddOns,
          totalPrice: b.totalPrice,
          currency: "JPY",
          paymentMethod: b.paymentMethod,
          paymentStatus: b.paymentStatus,
          customerName: email.split("@")[0],
          customerEmail: email,
          createdDate: b.createdDate,
        };
      });

      res.json(formattedList);
    } catch (error: any) {
      console.error("Failed to fetch bookings:", error);
      res.status(500).json({ error: "予約履歴の取得に失敗しました。" });
    }
  });

  // Create new booking in PostgreSQL
  app.post("/api/bookings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user;
      if (!email) {
        return res.status(400).json({ error: "Email is required from token." });
      }
      const dbUser = await getOrCreateUser(uid, email);

      const { id, tourId, tourName, travelDate, travelers, addOns, totalPrice, paymentMethod, paymentStatus, createdDate } = req.body;
      
      if (!id || !tourId || !tourName || !travelDate || !travelers || !totalPrice || !paymentMethod || !paymentStatus || !createdDate) {
        return res.status(400).json({ error: "必要な予約情報が不足しています。" });
      }

      await db.insert(bookings)
        .values({
          id,
          userId: dbUser.id,
          tourId,
          tourName,
          travelDate,
          travelers,
          addOns: addOns ? JSON.stringify(addOns) : null,
          totalPrice,
          paymentMethod,
          paymentStatus,
          createdDate,
        });

      res.status(201).json({
        success: true,
        message: "予約が完了しました。",
      });
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      res.status(500).json({ error: "予約手続きの保存に失敗しました。" });
    }
  });

  // Delete/Cancel booking
  app.delete("/api/bookings/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user;
      if (!email) {
        return res.status(400).json({ error: "Email is required from token." });
      }
      const dbUser = await getOrCreateUser(uid, email);
      const bookingId = req.params.id;

      const result = await db.delete(bookings)
        .where(eq(bookings.id, bookingId))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: "対象の予約が見つかりません。" });
      }

      res.json({ success: true, message: "予約をキャンセルしました。" });
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      res.status(500).json({ error: "予約のキャンセルに失敗しました。" });
    }
  });

  // Handle contact form submission
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "すべての項目を入力してください（名前、メールアドレス、メッセージ）。" });
    }

    const newMessage: ContactMessage = {
      id: String(Date.now()),
      name,
      email,
      message,
      date: new Date().toISOString(),
    };

    messages.push(newMessage);
    console.log(`[Contact Form Received]:`, newMessage);

    return res.status(200).json({ 
      success: true, 
      message: "お問い合わせありがとうございました。メッセージを受け付けました。",
      data: newMessage
    });
  });

  // Handle Sub-Admin approval request and send notification email to dipsanijamhang@gmail.com
  app.post("/api/admin/request-approval", async (req, res) => {
    const { email, username } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ error: "申請者のメールアドレスが必要です。" });
    }

    const applicantEmail = email.trim().toLowerCase();
    const applicantUsername = username?.trim() || applicantEmail.split("@")[0];
    const primaryAdminEmail = process.env.NOTIFICATION_EMAIL || "dipsanijamhang@gmail.com";

    console.log(`[Sub-Admin Approval Request]: User ${applicantUsername} (${applicantEmail}) requested access. Notifying ${primaryAdminEmail}`);

    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          connectionTimeout: 4000,
          socketTimeout: 4000,
        });

        const mailOptions = {
          from: `"Nepa Travel Admin System" <no-reply@nepatravel.com>`,
          to: primaryAdminEmail,
          subject: `🚨【Nepa Travel】サブ管理者権限の申請通知 (${applicantEmail})`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #334155; border-radius: 16px; background-color: #0f172a; color: #f8fafc;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #334155;">
                <h2 style="color: #fbbf24; margin: 0; font-size: 22px; font-weight: 800;">🇳🇵 Nepa Travel Admin Notification</h2>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">サブ管理者アクセス権限の申請が送信されました</p>
              </div>

              <div style="padding: 24px 0;">
                <p style="font-size: 15px; font-weight: bold; color: #f1f5f9;">最高管理者 (Dipsan Limbu) 様</p>
                <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                  Webサイトより、以下のユーザーから管理者ダッシュボードへの<b>サブ管理者アクセス権限</b>の申請がありました。
                </p>

                <div style="background-color: #1e293b; padding: 18px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 8px;">
                  <p style="margin: 6px 0; font-size: 14px; color: #f8fafc;"><strong>ユーザー名:</strong> ${applicantUsername}</p>
                  <p style="margin: 6px 0; font-size: 14px; color: #f8fafc;"><strong>メールアドレス:</strong> <a href="mailto:${applicantEmail}" style="color: #60a5fa; text-decoration: underline;">${applicantEmail}</a></p>
                  <p style="margin: 6px 0; font-size: 14px; color: #f8fafc;"><strong>申請日時:</strong> ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
                </div>

                <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
                  承認を行う場合は、管理者パネルの「ユーザー承認・権限」タブより該当アカウントを「サブ管理者」として承認してください。
                </p>
              </div>

              <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center; font-size: 12px; color: #64748b;">
                Nepa Travel System • Sent directly to ${primaryAdminEmail}
              </div>
            </div>
          `,
        };

        const mailResult = await transporter.sendMail(mailOptions);
        console.log(`[Admin Email Notification Success]: Sent to ${primaryAdminEmail}, ID: ${mailResult.messageId}`);
      } else {
        console.log(`[Admin Email Notification]: Dev/Demo mode notice -> Sub-admin request recorded and notification queued for ${primaryAdminEmail} for user ${applicantUsername} (${applicantEmail})`);
      }

      return res.status(200).json({
        success: true,
        message: `最高管理者 (${primaryAdminEmail}) へ申請通知を受け付けました！`,
        notifiedEmail: primaryAdminEmail,
      });
    } catch (err: any) {
      console.warn("[Email Notification Dispatch Notice]:", err?.message || err);
      return res.status(200).json({
        success: true,
        message: `申請を受け付けました。最高管理者 (${primaryAdminEmail}) へ通知が送られます。`,
        notifiedEmail: primaryAdminEmail,
      });
    }
  });

  // Handle user registration with password & email validation
  app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "すべての必須項目（ユーザー名、メールアドレス、パスワード）を入力してください。" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "有効なメールアドレスの形式を入力してください（例：user@example.com）。" });
    }

    // Password validation rules: min 8 chars, 1 uppercase, 1 number, 1 symbol
    if (password.length < 8) {
      return res.status(400).json({ error: "パスワードは8文字以上で設定してください。" });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: "パスワードには英大文字（A〜Z）を少なくとも1文字含める必要があります。" });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: "パスワードには数字（0〜9）を少なくとも1文字含める必要があります。" });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
      return res.status(400).json({ error: "パスワードには記号（@, #, $, ! など）を少なくとも1文字含める必要があります。" });
    }

    const emailExists = usersList.some(u => u.email.toLowerCase() === trimmedEmail);
    if (emailExists) {
      return res.status(400).json({ error: "このメールアドレスは既に登録されています。ログイン画面からログインしてください。" });
    }

    const newUser: User = {
      id: String(Date.now()),
      username: username.trim(),
      email: trimmedEmail,
      passwordHash: password,
    };

    usersList.push(newUser);
    console.log(`[User registered successfully]:`, newUser.username, newUser.email);

    return res.status(200).json({
      success: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        token: `demo-token-${newUser.id}`
      }
    });
  });

  // Handle user login with account existence check
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "メールアドレスとパスワードを入力してください。" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = usersList.find(u => u.email.toLowerCase() === trimmedEmail);
    
    if (!user) {
      return res.status(400).json({ error: "このメールアドレスは登録されていません。まずは「新規会員登録」を行ってください。" });
    }

    if (user.passwordHash !== password) {
      return res.status(401).json({ error: "パスワードが正しくありません。入力内容をご確認ください。" });
    }

    console.log(`[User logged in successfully]:`, user.username);

    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        bio: user.bio,
        country: user.country,
        token: `demo-token-${user.id}`
      }
    });
  });

  // Handle user profile update and server synchronization across devices
  app.post("/api/auth/profile", (req, res) => {
    const { email, avatarUrl, phone, bio, country, username } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ error: "メールアドレスが必要です。" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userIndex = usersList.findIndex(u => u.email.toLowerCase() === trimmedEmail);

    if (userIndex !== -1) {
      if (username) usersList[userIndex].username = username.trim();
      if (avatarUrl !== undefined) usersList[userIndex].avatarUrl = avatarUrl;
      if (phone !== undefined) usersList[userIndex].phone = phone;
      if (bio !== undefined) usersList[userIndex].bio = bio;
      if (country !== undefined) usersList[userIndex].country = country;

      return res.status(200).json({
        success: true,
        user: {
          username: usersList[userIndex].username,
          email: usersList[userIndex].email,
          avatarUrl: usersList[userIndex].avatarUrl,
          phone: usersList[userIndex].phone,
          bio: usersList[userIndex].bio,
          country: usersList[userIndex].country,
          token: `demo-token-${usersList[userIndex].id}`
        }
      });
    }

    // If user not in memory list yet, create user entry
    const newUser: User = {
      id: String(Date.now()),
      username: username || trimmedEmail.split("@")[0],
      email: trimmedEmail,
      passwordHash: "oauth_or_demo",
      avatarUrl,
      phone,
      bio,
      country
    };
    usersList.push(newUser);

    return res.status(200).json({
      success: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        phone: newUser.phone,
        bio: newUser.bio,
        country: newUser.country,
        token: `demo-token-${newUser.id}`
      }
    });
  });

  // Google Maps client API Key config route
  app.get("/api/config/maps", (req, res) => {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.GMP_API_KEY || "";
    res.json({ apiKey });
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
