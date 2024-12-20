'use client';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const clientInstance = axios.create({
  baseURL: BASE_URL,
});

export { clientInstance };
