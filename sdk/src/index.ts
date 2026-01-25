export * from './core/Plugin';
export * from './core/PluginContext';

import axios, { type AxiosInstance } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 1. HTTP Client
export let http = axios.create();
export function setSdkApi(instance: AxiosInstance) {
    http = instance;
}
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

// 4. UI Components
export * from './components/ui/button';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/form';
export * from './components/ui/textarea';
export * from './components/ui/dialog';
export * from './components/ui/alert';
export * from './components/ui/card';
export * from './components/ui/calendar';
export * from './components/ui/popover';
export * from './components/ui/checkbox';
export * from './components/ui/radio-group';
export * from './components/ui/scroll-area';
export * from './components/ui/sheet';
export * from './components/ui/table';
export * from './components/ui/dropdown-menu';
export * from './components/ui/skeleton';

// 5. External Libs
export * as dateFns from 'date-fns';
export * from './lib/utils';
