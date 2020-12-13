interface Table {
  name: string;
  keyPath: string | string[];
}

class Database {
  private dbFactory: IDBFactory;
  public instance?: IDBDatabase;

  constructor(private name: string, private tables: Table[]) {
    this.dbFactory = window.indexedDB;
    this.init();
  }

  init() {
    const request = this.dbFactory.open(this.name);
    request.onupgradeneeded = this.addTables;
    request.onsuccess = (event: any) => {
      database.instance = event.target.result;
    };
  }

  addTables(event: any) {
    database.instance = event.target.result as IDBDatabase;
    database.tables.forEach((table) => {
      const store = database.instance!.createObjectStore(table.name, {
        keyPath: table.keyPath,
      });
      store.createIndex(table.name, table.keyPath, { unique: true });
    });
  }

  async get(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = this.dbFactory.open(this.name);
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject({ message: "database error", event });
      };
    });
  }
}

class Dao<T> {
  constructor(private database: Database, private table: Table) {}

  private async transact(
    operation: (store: IDBObjectStore) => IDBRequest
  ): Promise<any> {
    const dbInstance = await this.database.get();
    const transaction = dbInstance.transaction([this.table.name], "readwrite");
    const store = transaction.objectStore(this.table.name);

    const request = operation(store);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject({ message: "database error", event });
      };
    });
  }

  async add(obj: T) {
    await this.transact((store) => store.add(obj));
  }

  async getAll(): Promise<T[]> {
    return this.transact((store) => store.getAll());
  }

  async delete(key: string | string[]): Promise<T[]> {
    return this.transact((store) => store.delete(key));
  }

  async put(obj: T): Promise<T[]> {
    return this.transact((store) => store.put(obj));
  }
}

const repoTable = {
  name: "repos",
  keyPath: ["owner", "name"],
};

const database = new Database("release-monitor", [repoTable]);

export interface Repo {
  owner: string;
  name: string;
  latestVersion?: string;
  releaseDate?: Date;
  isNew: boolean;
}

const repoDao = new Dao<Repo>(database, repoTable);

export default repoDao;
