/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TourPackage {
  id: string;
  name: string;
  nameJp: string;
  description: string;
  price: string;
  image: string;
  duration: string;
  rating: number;
  tags?: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tourName: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface User {
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  country?: string;
  avatarUrl?: string;
  token?: string;
}
