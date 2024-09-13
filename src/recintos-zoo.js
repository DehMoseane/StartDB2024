class RecintosZoo {
    constructor() {
        // Recintos existentes
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        // Tabela de animais
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(especie, quantidade) {
        // Valida se a espécie é válida
        if (!this.animais[especie]) {
            return { erro: "Animal inválido" };
        }

        // Valida se a quantidade é válida
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animal = this.animais[especie];
        const recintosViaveis = [];

        // Percorre todos os recintos e verifica viabilidade
        for (const recinto of this.recintos) {
            const espacoOcupado = recinto.animais.reduce((total, a) => {
                const espacoAnimal = this.animais[a.especie].tamanho * a.quantidade;
                return total + espacoAnimal;
            }, 0);

            // Verifica se o bioma é adequado
            if (!animal.biomas.includes(recinto.bioma)) continue;

            // Verifica se o recinto tem espaço suficiente
            const espacoNecessario = animal.tamanho * quantidade;
            const espacoLivre = recinto.tamanho - espacoOcupado;

            if (espacoNecessario > espacoLivre) continue;

            // Verifica as regras de convivência (carnívoros só com a mesma espécie)
            const carnívorosPresentes = recinto.animais.some(a => this.animais[a.especie].carnivoro);
            if (animal.carnivoro && carnívorosPresentes && recinto.animais[0].especie !== especie) continue;

            // Regras específicas do hipopótamo
            if (especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) continue;

            // Verifica a regra do macaco (não pode estar sozinho)
            if (especie === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) continue;

            // Inclui o recinto viável
            recintosViaveis.push({
                numero: recinto.numero,
                espacoLivre: espacoLivre - espacoNecessario,
                espacoTotal: recinto.tamanho
            });
        }

        // Retorna a lista de recintos ou mensagem de erro
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        } else {
            return {
                recintosViaveis: recintosViaveis
                    .sort((a, b) => a.numero - b.numero)
                    .map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
            };
        }
    }
}

// Exemplo de chamada
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos('MACACO', 2));



