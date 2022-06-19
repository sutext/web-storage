declare namespace orm {
    interface IMetaClass<T> {
        new (json?: any): T;
    }
    /**
     * @description  A class decorate use to store class.
     * @param clskey the class name of your storage class
     * @param idxkey the primary key field name of your storage class
     * @notice the idxkey must be exist in the metaclass
     */
    const Entity: (
        clskey: string,
        idxkey: string
    ) => <T>(target: IMetaClass<T>) => void;
    /**
     * @description  A property decorate to mark a field  also a store class.
     * @param cls the class of field.
     * @param map is map or not
     */
    const Field: <T>(
        cls: IMetaClass<T>,
        map?: boolean
    ) => (target: Object, field: string) => void;
    /**
     * @description save an storage able class.
     * @param model the model class must be mark with @Entity(...)
     * @throws did't mark error
     */
    const save: <T>(model: T) => void;
    /**
     * @description find an storaged object whith id.
     * @param cls the storage class witch must be mark with @Entity(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    const find: <T>(cls: IMetaClass<T>, id: string | number) => T;
    /**
     * @description find all storaged object's primary key of cls.
     * @param cls the storage class witch must be mark with @Entity(...)
     * @throws did't mark error
     */
    const ids: <T>(cls: IMetaClass<T>) => string[];
    /**
     * @description find all storaged object of cls.
     * @param cls the storage class witch must be mark with @Entity(...)
     * @throws did't mark error
     */
    const all: <T>(cls: IMetaClass<T>) => T[];
    /**
     * @description get the count of all storaged object of cls.
     * @param cls the storage class witch must be mark with @Entity(...)
     * @throws did't mark error
     */
    const count: <T>(cls: IMetaClass<T>) => number;
    /**
     * @description remove all storaged object of cls.
     * @param cls the storage class witch must be mark with @Entity(...)
     * @throws did't mark error
     */
    const clear: <T>(cls: IMetaClass<T>) => void;
    /**
     * @description remove an special storaged object of cls.
     * @param cls the storage class witch must be mark with @Entity(...)
     * @param id the primary key of the cls
     * @throws did't mark error
     */
    const remove: <T>(cls: IMetaClass<T>, id: string | number) => void;
}
export default orm;
