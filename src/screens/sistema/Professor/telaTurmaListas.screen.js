import React, { Component } from "react";
import Teste from '../../../components/ui/modal/btnModal.component'

import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Swal from 'sweetalert2'
import BtnModal from 'components/ui/modal/btnModal.component'
import BotaoModal from "components/ui/modal/btnModalLista.component"

export default class Pagina extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            items: [],
            loadingInfoTurma:true,
            turma:'',
            todasListas: [],
        };
    }

    async componentDidMount() {
        this.getListas()
        this.getTodasListas()
        await this.getInfoTurma()
        document.title = `${this.state.turma.name} - listas`;
         
        //this.getTodasListas()
    }
    async getInfoTurma(){
        const id = this.props.match.params.id
        try{
            const response = await api.get(`/class/${id}`)
            this.setState({
                turma:response.data,
                loadingInfoTurma:false,
            })
        }
        catch(err){
            this.setState({loadingInfoTurma:false})
            console.log(err);
        }
    }

    async inserirLista(list){
        console.log("id da lista")
        console.log(list.id)
        const idTurma = this.props.match.params.id
        try{
            if(list.id){
              Swal.fire({
                title:'Processando',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
              })
              Swal.showLoading()
              
              const response = await api.post(`/class/${idTurma}/addList/list/${list.id}`)
              await this.getTodasListas()
              await this.getListas()
              Swal.hideLoading()
              Swal.fire({
                  type: 'success',
                  title: 'Lista Adicionada com Sucesso!',
              })
            }
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Lista não pôde ser adicionado',
          })
        } 
    }

    async getListas(){
        try{
            const id = this.props.match.params.id
            const response = await api.get(`/class/${id}/lists`)
            console.log(response.data);
            this.setState({items:[...response.data]})

        }catch(err){
            console.log(err)
        
        }
    };

    async getTodasListas(){
        try{
            const id = this.props.match.params.id
            const response = await api.get(`/listQuestion/class/${id}/page/1`)
            console.log('listas');
            console.log(response.data.docs);
            this.setState({todasListas:response.data.docs})
        }catch(err){
            console.log(err)
        
        }
    };
    
    render() {
        
        const {loadingInfoTurma,turma} = this.state
        return (
        <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
            <div>
               {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/>  {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
                <br/>
                <div className="col-3">
                <BtnModal
                    onClick={this.inserirLista.bind(this)}
                    listas={this.state.todasListas}
                />
                </div>
                <br/>

                <div>
                </div>

                <div className="col-12">
                    <table  style={{backgroundColor:"white"}} className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome: </th>
                                <th>Codigo: </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map((lista, index)=>(
                                <tr key={index}>
                                   <td>{lista.title}</td>
                                   <td>{lista.code}</td>
                                   <td className="float-right">
                                       <BotaoModal
                                            lista={lista}
                                       />
                                   </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-6">
                    <table>

                    </table>
                </div>
            </div>

        </TemplateSistema>
        )
    }
}