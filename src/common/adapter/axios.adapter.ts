import axios, { AxiosInstance } from "axios";
import { HttpAdapterInterface } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";

// * LOS PROVIDERS ESTAN A NIVEL DE MODULE(SE NECESITA EXPORTACION E IMPORTACION PARA SU USO)
// ! PATRON ADAPTADOR / WRAPPER PARA MANEJAR EL PAQUETE AXIOS QUE USAMOS PARA REALIZAR LA PETICIONES 
// ? PODEMOS CREAR OTROS ADAPTADORES QUE IMPLEMENTEN LA INTERFAZ Y ASI CAMBIAR DE PAQUETE FACILMENTE
@Injectable()
export class AxiosAdapter implements HttpAdapterInterface {
    
    // ? instance de axios
    private axios: AxiosInstance = axios;

    // ? metodo get que posee por defecto(puede poseer mas si se lo define aqui o en la interface)
    async get<T>(url: string): Promise<T> {
        try {
            
            // * realizamos la peticio http
            const { data } = await this.axios.get<T>( url );

            // * devolvemos la data de este get
            return data;

        } catch (error) {
            throw new Error(`This is an error - check logs.`)
        }
    }

}