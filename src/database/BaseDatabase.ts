import knex from 'knex';

export abstract class BaseDataBase {
	protected static connection = knex({
		client: 'sqlite3',
		connection: {
			filename: './src/database/labeddit.db', //localização do seu arquivo .db
		},
		useNullAsDefault: true, // definirá NULL quando encontrar valores undefined
		pool: {
			min: 0, // número de conexões, esses valores são os recomendados para sqlite3
			max: 1,
			afterCreate: (conn: any, cb: any) => {
				conn.run('PRAGMA foreign_keys = ON', cb);
			}, // configurando para o knex forçar o check das constrainst FK
			// para entender melhor, depois assista o vídeo de refatoração de DELETE users by id
		},
	});
}
