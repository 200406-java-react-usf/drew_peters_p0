export interface CrudRepository<Type> {
    getAll(): Promise<Type[]>;
    getById(id: number): Promise<Type>;
    save(newObj: Type): Promise<Type>;
    update(updatedObj: Type): Promise<boolean>;
}