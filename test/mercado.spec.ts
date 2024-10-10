import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker/.';

describe('Mercado', () => {
    const p = pactum;
    const rep = SimpleReporter;
    const baseUrl = 'https://api-desafio-qa.onrender.com';

    p.request.setDefaultTimeout(30000);

    let itemId;
    beforeAll(async () => {
        p.reporter.add(rep);
        //Retorna todos os dados da constante mercado
        const response = await p
            .spec()
            .get(`${baseUrl}/mercado`)
            .expectStatus(StatusCodes.OK)
            .returns('res.body');

        itemId = response[0].id;
    });
    afterAll(async () => {
        //Remove um mercado específico pelo ID.
        await p
            .spec()
            .put(`${baseUrl}/mercado/${itemId}`)
            .expectStatus(StatusCodes.OK)
        p.reporter.end();
    });

    describe('GET', () => {
        it('Retorna todos os dados da constante mercado', async () => {
            const response = await p
                .spec()
                .get(`${baseUrl}/mercado`)
                .expectStatus(StatusCodes.OK)
                .returns('res.body');

            itemId = response[0].id;
        });
    });

    describe('POST', () => {
        it('Cria um novo registro de mercado com estruturas de categorias e subcategorias de produtos inicialmente vazias.', async () => {
            await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .withJson({
                    name: `MercadoTeste ${Date.now().toPrecision}`,
                    cnpj: "12345678912345",
                    endereco: `EnderecoTeste ${Date.now()}`
                })
                .expectStatus(StatusCodes.CREATED)
        });
    });

    const cnpjErro = "123456";

    describe('POST', () => {
        it('Erro tamanho de cnpj ao criar um novo registro de mercado', async () => {
            await p
                .spec()
                .post(`${baseUrl}/mercado`)
                .withBody({
                    name: "Mercado Teste",
                    cnpj: cnpjErro,
                    endereco: "testes"
                })
                .expectStatus(StatusCodes.BAD_REQUEST)
                .expectJson(
                    {
                        "errors": [
                            {
                                "type": "field",
                                "msg": "Nome é obrigatório",
                                "path": "nome",
                                "location": "body"
                            },
                            {
                                "type": "field",
                                "msg": "CNPJ deve ter 14 dígitos",
                                "path": "cnpj",
                                "location": "body",
                                "value": cnpjErro
                            }
                        ]
                    }
                )
        });
    });

    describe('GET', () => {
        it('Retorna um mercado especificado pelo ID.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/1`)
                .expectStatus(StatusCodes.OK)
        });
    });

    describe('GET', () => {
        it('Não retorna um mercado especificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('PUT', () => {
        it('Atualiza um mercado específico pelo ID com as informações fornecidas.', async () => {
            await p
                .spec()
                .put(`${baseUrl}/mercado/${itemId}`)
                .withJson({
                    name: `MercadoTeste ${Date.now().toPrecision}`,
                    cnpj: "12345678912345",
                    endereco: `EnderecoTeste ${Date.now()}`
                })
                .expectStatus(StatusCodes.OK)
        });
    });

    describe('PUT', () => {
        it('Não atualiza um mercado específico pelo ID com as informações fornecidas, erro em cnpj errado.', async () => {
            await p
                .spec()
                .put(`${baseUrl}/mercado/${itemId}`)
                .withBody({
                    name: `MercadoTeste ${Date.now()}`,
                    cnpj: cnpjErro,
                    endereco: `EnderecoTeste ${Date.now()}`
                })
                .expectStatus(StatusCodes.BAD_REQUEST)
        });
    });

    describe('PUT', () => {
        it('Não atualiza um mercado específico pelo ID com as informações fornecidas, erro em id errado.', async () => {
            await p
                .spec()
                .put(`${baseUrl}/mercado/0`)
                .withBody({
                    name: `MercadoTeste ${Date.now()}`,
                    cnpj: cnpjErro,
                    endereco: `EnderecoTeste ${Date.now()}`
                })
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('DELETE', () => {
        it('Não remove um mercado específico pelo ID, id não encontrado.', async () => {
            await p
                .spec()
                .put(`${baseUrl}/mercado/0`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('GET', () => {
        it('Não retorna todos os produtos associados a um mercado específico, identificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('GET', () => {
        it('Não retorna a lista de frutas da categoria hortifruit do mercado especificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/hortifruit/frutas`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('GET', () => {
        it('Não retorna a lista de legumes da categoria hortifruit do mercado especificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/hortifruit/legumes`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('GET', () => {
        it('Não retorna a lista de doces da categoria padaria do mercado especificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/padaria/doces`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('GET', () => {
        it('Não retorna a lista de salgados da categoria padaria do mercado especificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/padaria/salgados`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

    describe('GET', () => {
        it('Não retorna a lista de bovinos da categoria acougue do mercado especificado pelo ID, pois o mesmo não existe no banco.', async () => {
            await p
                .spec()
                .get(`${baseUrl}/mercado/0/produtos/acougue/bovinos`)
                .expectStatus(StatusCodes.NOT_FOUND)
        });
    });

});
