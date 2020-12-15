#!/usr/bin/env node
export interface Config {
    input: string;
    dir: string;
    prefix: string;
    themes: ThemeDetail[];
}
export interface ThemeDetail {
    name: string;
    slug: string;
    type: 'dark' | 'light';
    colors: {};
}
