import { MMKV } from 'react-native-mmkv';
import {StorageKeys} from "@/services/storage/storage.keys";



/**
 * Storage service using MMKV for high-performance data persistence
 */
export class StorageService {
    private static storage: MMKV = new MMKV({ id: 'app-storage' });

    /**
     * Set a value in storage with automatic type handling
     */
    static set<T>(key: StorageKeys | string, value: T): void {
        if (value === undefined) {
            this.storage.delete(key);
            return;
        }

        const valueType = typeof value;

        switch (valueType) {
            case 'string':
                this.storage.set(key, value as string);
                break;
            case 'number':
                this.storage.set(key, value as number);
                break;
            case 'boolean':
                this.storage.set(key, value as boolean);
                break;
            case 'object':
                this.storage.set(key, JSON.stringify(value));
                break;
            default:
                this.storage.set(key, String(value));
        }
    }

    /**
     * Get a value from storage with type inference
     */
    static get<T>(
        key: StorageKeys | string,
        expectedType: 'string' | 'boolean' | 'number' | 'object' = 'string',
        defaultValue?: T
    ): T | undefined {
        if (!this.storage.contains(key)) {
            return defaultValue;
        }

        // Use explicit expectedType if provided, otherwise infer from defaultValue
        const valueType = expectedType || typeof defaultValue;

        let _value;
        switch (valueType) {
            case 'string':
                _value = this.storage.getString(key);
                return _value as unknown as T;

            case 'boolean':
                _value = this.storage.getBoolean(key);
                return _value as unknown as T;

            case 'number':
                _value = this.storage.getNumber(key);
                return _value as unknown as T;

            case 'object':
                _value = this.storage.getString(key);
                if (_value !== undefined) {
                    try {
                        return JSON.parse(_value) as T;
                    } catch {
                        return defaultValue;
                    }
                }
                return defaultValue;

            default:
                // Fallback to string if type is unknown
                _value = this.storage.getString(key);
                return _value as unknown as T;
        }
    }

    /**
     * Remove a value from storage
     */
    static remove(key: string): void {
        this.storage.delete(key);
    }

    /**
     * Check if a key exists in storage
     */
    static has(key: string): boolean {
        return this.storage.contains(key);
    }

    /**
     * Clear all values from storage
     */
    static clear(): void {
        this.storage.clearAll();
    }

    /**
     * Get all keys in storage
     */
    static getAllKeys(): string[] {
        return this.storage.getAllKeys();
    }
}
