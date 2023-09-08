import { environment } from '../environment/environment';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, onValue  } from "firebase/database";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from '../chat/chat'
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'firechat';
  app!: FirebaseApp;
  db!: Database;
  form!: FormGroup;
  username = '';
  message = '';
  chats: Chat[] = [];

  secondUserChat: Chat[]=[];


  constructor(private formBuilder: FormBuilder) {
    this.app = initializeApp(environment.firebase);
    this.db = getDatabase(this.app);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : []
    });
  }

  onChatSubmit(form: any) {
    const chat = form;
    chat.timestamp = new Date().toString();
    chat.id = uuidv4();
    set(ref(this.db, `chats/${chat.id}`), chat);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : [chat.username],
    });

    const chat2 = form;
    chat.timestamp = new Date().toString();
    chat.id = uuidv4();
    set(ref(this.db, `seconduserchats/${chat2.id}`), chat2);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : [chat.username],
    });
  }

  // ngOnInit(): void {
  //   const chatsRef = ref(this.db, 'chats');
  //   onValue(chatsRef, (snapshot: any) => {
  //     const data = snapshot.val();
  //     for(let id in data) {
  //       console.log(data);
  //       if (!this.chats.map(chat => chat.id).includes(id)) {
  //         this.chats.push(data[id]);
         
          
  //       }
  //     }
  //   });
  // }

  ngOnInit(): void {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      for (let id in data) {

     
        const username = data[id].username; // Access the username property
        console.log(username);
        
        if (!this.chats.map(chat => chat.id).includes(id)) {
          this.chats.push(data[id]);
        }
      }
    });


    const secondChatsRef =  ref(this.db,'seconduserchats');
    onValue(secondChatsRef,(snapshot:any) =>{
      const data =  snapshot.val();
      for(let id in data){
        const username = data[id].username;
        if (!this.secondUserChat.map(chat => chat.id).includes(id)) {
         this.secondUserChat.push(data[id]);
        }
      }
    })
  }



}
