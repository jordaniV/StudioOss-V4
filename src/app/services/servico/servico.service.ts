import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Servico } from './../../domains/servico';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private Collection: AngularFirestoreCollection<Servico>;
  public servicos: Observable<Servico[]>; // private

  constructor(public db: AngularFirestore) {
    this.Collection = this.db.collection<Servico>('servicos');

    this.servicos = this.Collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAll() {
    return this.servicos;
  }

  getServico(id: string) {
    return this.Collection.doc<Servico>(id).valueChanges();
  }

  update(servico: Servico, id: string) {
    return this.Collection.doc(id).update(servico);
  }

  add(servico: Servico) {
    return this.Collection.add(servico);
  }

  remove(id: string): Promise<void> {
    return this.Collection.doc(id).delete();
  }
}
