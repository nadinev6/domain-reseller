/// <reference types="vite/client" />

declare namespace React {
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export interface ComponentType<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export interface SVGProps<T> extends HTMLAttributes<T> {
    [key: string]: any;
  }
  
  export interface HTMLAttributes<T> {
    [key: string]: any;
  }
  
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => JSX.Element | null): ComponentType<P>;
  export function memo<P>(Component: ComponentType<P>): ComponentType<P>;
  
  export const StrictMode: ComponentType<{ children?: any }>;
  export const Fragment: ComponentType<{ children?: any }>;
}

declare namespace JSX {
  interface Element {
    type: any;
    props: any;
    key: any;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export interface ComponentType<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export interface SVGProps<T> extends HTMLAttributes<T> {
    [key: string]: any;
  }
  
  export interface HTMLAttributes<T> {
    [key: string]: any;
  }
  
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => JSX.Element | null): ComponentType<P>;
  export function memo<P>(Component: ComponentType<P>): ComponentType<P>;
  
  export const StrictMode: ComponentType<{ children?: any }>;
  export const Fragment: ComponentType<{ children?: any }>;
  
  export default {
    FC,
    ComponentType,
    SVGProps,
    HTMLAttributes,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    useContext,
    createContext,
    forwardRef,
    memo,
    StrictMode,
    Fragment
  };
}

declare module 'react-dom' {
  export function render(element: JSX.Element, container: Element | null): void;
  export const createRoot: (container: Element | null) => {
    render: (element: JSX.Element) => void;
  };
}

declare module 'react-dom/client' {
  export const createRoot: (container: Element | null) => {
    render: (element: JSX.Element) => void;
  };
}

declare module 'react/jsx-runtime' {
  export const jsx: (type: any, props: any, key?: any) => JSX.Element;
  export const jsxs: (type: any, props: any, key?: any) => JSX.Element;
  export const Fragment: React.ComponentType<{ children?: any }>;
}

declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  export const Globe: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Clock: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const CheckCircle: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const User: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Settings: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const CreditCard: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Bell: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const HelpCircle: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Shield: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const LogOut: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Search: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const ShoppingCart: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Menu: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const X: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Plus: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Minus: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Trash2: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Edit: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Save: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Download: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Upload: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Image: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Type: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Square: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Circle: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const MousePointer: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Undo: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Redo: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Copy: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Layers: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Eye: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const EyeOff: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Lock: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Unlock: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const MessageCircle: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Send: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const ChevronDown: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const ChevronUp: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const ChevronLeft: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const ChevronRight: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Star: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Heart: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Bookmark: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Share: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const ExternalLink: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const AlertCircle: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Info: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const CheckCircle2: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const XCircle: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Loader: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Refresh: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Home: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Folder: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const File: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Calendar: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Mail: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Phone: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const MapPin: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const Filter: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const SortAsc: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const SortDesc: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const MoreHorizontal: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  export const MoreVertical: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
}
