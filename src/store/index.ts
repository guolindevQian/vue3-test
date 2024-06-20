import { defineStore } from 'pinia'
import { Names } from './store-namespace'

export const useTestStore = defineStore(Names.Test, {
    state: () => {
        return {
            current:1,
            name:'12',
            token:""
        }
    },
    getters:{},
    actions:{
        setCurrent(){
            this.current++
        },
        setName(name:string){
            this.name = name;
        }
    },
    persist:{
        key:'storekey',
        storage:window.sessionStorage,
        paths:['current','token']
    }
})