import { backendWebApiUrl } from "@/config/config";
import type { ProsConsMessage } from "@/interfaces";

interface ProsConsDiscusserUseCase {
    prompt: string;
}

export const prosConsDiscusserUseCase = async ( {prompt}: ProsConsDiscusserUseCase) => {

    try {

        const resp = await fetch(`${backendWebApiUrl}/pros-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        

        if (!resp.ok) {
            return {
                ok: false,
                content: "",
            }
        }

        const data = await resp.json() as ProsConsMessage;

        return {
            ok: true,
            ...data
        }

    } catch (error) {
        return{
            ok: false,
            content: "",
        }
    }

}
