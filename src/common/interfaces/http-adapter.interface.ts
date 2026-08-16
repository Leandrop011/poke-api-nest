
export interface HttpAdapterInterface{
    get<T>( url: string ): Promise<T>;
    
}
