<template>
<Skeleton   v-if="!showTable" />

<div v-if="showTable">

<div class="card my-4  bg-color-3 p-0" >

    <div class="card-body ">

<ul class="list-inline text-left border-bottom pt-3">
<li class="list-inline-item text-capitalize m-2">{{$t('Total')+': '+ total}}</li>
<li class="list-inline-item text-capitalize m-2">{{$t('Page')+': '+current_page+' / '+last_page}}</li>

</ul>
    <!-- table -->
    <div class="table-responsive mt-3">
    <table class="table  table-striped">
    <thead>
    <tr>
        <th v-for="field in fields" scope="col" :key="field.keydb23">{{$t(field.label)}}</th>
        <th>{{$t('Created at')}}</th>
        <th>{{$t('Updated at')}}</th>
        <th>{{$t('Action')}}</th>
        
    </tr>
    </thead>
    <tbody>

    <tr v-for="item in items" :key="item.keydb23">
        <td v-for="field in fields" :key="field.keydbCOL23">{{item[field.key]}}</td>
        <td>{{ moment(item.created_at).format("DD-MM-yy,  h:m a") }}</td>
        <td>{{ moment(item.updated_at).format("DD-MM-yy,   h:m a") }}</td>
        <td>
        <router-link type="link" class="btn-sm btn-primary m-1" :title="$t('edit')" :to="{ name: 'Edit Product',params: { id:item.id }  }">
         Edit
        </router-link>
        
        </td>
    </tr>
        
    
    
    
    </tbody>
</table>
</div>
    <!-- table ./-->

    <nav aria-label="...">
        <ul class="pagination">
            <li class="page-item ">
            <a class="page-link" v-if="first_page_url" @click="navPages(first_page_url)" >  
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-bar-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"/>
                </svg>
            </a>
            </li>
            <li class="page-item ">
            <a class="page-link" v-if="prev_page_url" @click="navPages(prev_page_url)" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
                </svg>
                </a>
            </li>
        
            <li class="page-item active" aria-current="page">
            <a class="page-link" >{{current_page}}</a>
            </li>
            
            <li class="page-item">
            <a class="page-link" v-if="next_page_url" @click="navPages(next_page_url)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
            </svg>
            </a>
            </li>
            <li class="page-item ">
            <a class="page-link" v-if="last_page_url" @click="navPages(last_page_url)" >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-bar-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
            </svg>
            </a>
            </li>
        </ul>
        </nav>
        <div>

        </div>

    </div>
    </div>
</div>
</template>





<script>
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import {  email,numeric } from  '@vuelidate/validators'
import moment from 'moment'
    export default {
    setup () {
        return { v$: useVuelidate() }
    },
    created: function () {
    this.moment = moment;
    },
    /*********************** */
data() {
        return {
        form: {
            name: null,
            status:null,
            lang_id:this.$i18n.locale,
            isSearch:null,
            date_from:null,
            date_to:null,
        },
        file_url:null,
        statuses: [ 'active', 'deactivated', 'waiting review'],
        roles:[],
        errorsBack:{},
        current_page:null,
        last_page:null ,
        path:this.$store.state.backendUrl+"/admin/product",
        first_page_url:"",
        last_page_url:"",
        next_page_url:"",
        prev_page_url:"",
        per_page:null,
        total:null,
        showTable: false,
        isSendingForm:false,
        errorMgs:'',
        ShowError: false,
        fields: [
            {
            key: 'id',
            label: 'ID',
            sortable: true
            },
            {
            key: 'name',
            label:'name',
            sortable: true
            },
    
            {
            key: 'status',
            label: 'Status',
            sortable: true
            },
            
            
    
        ],
        items: []
        }
},
/***************** */
    validations() {
        return {
    form:{
    phone:{numeric},
    email: {email},
}
}
},

/***************** */
methods: {
    /***************** */
setTouched(theModel) {
        
        if(theModel == 'email' || theModel == 'all' ){this.v$.form.email.$touch()}
        if(theModel == 'phone' || theModel == 'all'){this.v$.form.phone.$touch()}
        
    },
    getCreateData(){
            this.file_url =null;
            this.showTable= false
            this.ShowError=false;
            axios.get(this.path, {params:this.form,
            headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            "Content-Type": "application/json",
            }
            })
            .then((response) => {
                if(this.form.export != 'excel'){
                // console.log(response);
                if(!this.isSearch){this.roles = response.data.roles}
            
                    var rows = response.data.rows;
                    this.items = rows.data;
                  console.log(this.items)
                    this.current_page=rows.meta.current_page;
                    this.last_page=rows.meta.last_page;
                    this.path=this.$store.state.backendUrl+"/admin/product";
                    this.first_page_url=rows.links.first;
                    this.last_page_url=rows.links.last;
                    this.next_page_url=rows.links.next;
                    this.prev_page_url=rows.links.prev;
                    this.per_page=rows.meta.per_page;
                    this.total=rows.meta.total;
                    }else{
                    
                    this.file_url = response.data.file_url;
            
                    }
                    this.showTable = !this.showTable;
                    this.showTable= true;
                    this.isSendingForm = false;
            
            })
            .catch( (error) => {
                this.showTable= false;
                this.ShowError=true;
                this.errorMgs = error;
                    this.isSendingForm = false;
                    
                
            });
            
        } ,
        /*************** */
        navPages(PageURl){
        this.path = PageURl;
            this.getCreateData();
        },
        /******************* */

        onSubmit(event) {
        event.preventDefault()
        if (!this.v$.$invalid) {

        this.isSendingForm = true;
        //alert(JSON.stringify(this.form))
        const formData = new FormData();
        for (const [key, value] of Object.entries(this.form)) {
                if(value != null){
                formData.append(key,value)
                // console.log(key, value);
                }
        }
        this.getCreateData();
        }
    },
    
        
},

mounted() {
        this.getCreateData();
        //this.form.lang_id = this.$i18n.locale;
        // if(this.$i18n.locale == 'ar') {this.localeDate ='ar-EG'}
    }

}
</script>
