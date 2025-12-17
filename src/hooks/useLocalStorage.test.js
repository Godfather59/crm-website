import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should return initial value if no value in localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
        expect(result.current[0]).toBe('initial');
    });

    it('should return stored value if value exists in localStorage', () => {
        window.localStorage.setItem('test-key', JSON.stringify('stored'));
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
        expect(result.current[0]).toBe('stored');
    });

    it('should update localStorage when value changes', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

        act(() => {
            result.current[1]('new-value');
        });

        expect(result.current[0]).toBe('new-value');
        expect(JSON.parse(window.localStorage.getItem('test-key'))).toBe('new-value');
    });

    it('should handle function updates', () => {
        const { result } = renderHook(() => useLocalStorage('count', 1));

        act(() => {
            result.current[1](prev => prev + 1);
        });

        expect(result.current[0]).toBe(2);
    });
});
