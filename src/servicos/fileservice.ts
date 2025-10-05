import * as fs from "fs";

export default class FileService {
    // para salva qualquer dado em json
    static salvar(caminho: string, data: any): void {
        try {
            const conteudo =
                typeof data === "string" ? data : JSON.stringify(data, null, 2);

            fs.writeFileSync(caminho, conteudo, { encoding: "utf-8" });
            console.log(`✅ Arquivo salvo em ${caminho}`);
        } catch (error) {
            console.error("Erro ao salvar arquivo:", error);
        }
    }

    // carrega dados de um arquivo json
    static carregar(caminho: string): any {
        try {
            if (!fs.existsSync(caminho)) {
                console.warn(`Arquivo não encontrado: ${caminho}`);
                return [];
            }

            const conteudo = fs.readFileSync(caminho, { encoding: "utf-8" });
            return JSON.parse(conteudo); // retorna como objeto ou array
        } catch (error) {
            console.error("Erro ao carregar arquivo:", error);
            return [];
        }
    }
}
