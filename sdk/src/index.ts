export * from './core/Plugin';
export * from './core/PluginContext';

import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 1. HTTP Client
export const http = axios.create();
export { AxiosError, type AxiosInstance } from 'axios';

// 2. Utils
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 3. Library Re-exports
export * as z from 'zod';
export * as Query from '@tanstack/react-query';
export * as Router from 'react-router-dom';
export * as Icons from 'lucide-react';
export { useForm, Controller, useFieldArray } from 'react-hook-form';
export { zodResolver } from '@hookform/resolvers/zod';
export { useTranslation, Trans } from 'react-i18next';
