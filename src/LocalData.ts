import { StorageType } from './StorageType';

/**
 * Data structure for Local storage
 */
export interface LocalData<T = any> {
    /**
     * 数据的唯一识别名
     */
    key: string;
    /**
     * 数据内容
     */
    value: T;
    /**
     * 数据所在的存储区
     */
    type: StorageType;
}
