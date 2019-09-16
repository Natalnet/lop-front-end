import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import Swal from "sweetalert2";
import BotaoModal from 'components/ui/modal/btnModalExercicios.component'
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
export default class CriarListaScreen extends Component {
    state = {
        redirect: false,
        items: [],
        selecionados: [],
        perfil: localStorage.getItem("user.profile")
    };

    componentDidMount() {
        this.getExercicio();
    }

    async getExercicio(){
        try{
            const response = await api.get('http://localhost:3001/question')
            this.setState({items:response.data})
        }catch(err){
            console.log(err)
        
        }
    };

    selecionar = questao =>{
        this.setState({
            selecionados: [
                ...this.state.selecionados,
                questao
                ]
        });
        console.log(this.state.questao)

    };

    render() {
        return (
        <TemplateSistema active='criarLista'>
            <div className="container-fluid">
                <form>
                    <div className="row">
                        <div className="form-group form-control col-12">
                            <div className="align-self-center">
                                 <h1>Criar Lista</h1><br></br>
                            </div>    
                            <br></br>

                            

                            <div className="row container">
                                <input 
                                    type="text" 
                                    className="form-control col-12" 
                                    placeholder="Titulo da lista"
                                />
                            </div>
                            <br></br>
                            <h4>Selecione as questões:</h4>
                            <br></br>

                            <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
                                <thead>
                                    <tr>
                                        <th>Titulo</th>
                                        <th>Dificuldade</th>
                                        <th>nota</th>
                                        <th></th>
                                        

                                    </tr>
                                </thead>                            
                                
                                <tbody>
                                {this.state.items.map((questao, index) => (
                                    <tr key={index}>
                                        <td>{questao.title}</td>
                                        <td>{questao.difficulty}</td>
                                        <td>8,5</td>
                                        <td>
                                            <button className="float-right btn btn-primary" onClick={()=>this.selecionar(questao)}>Adicionar</button>
                                        </td>
                                        
                                        
                                    </tr>
                                ))}
                                </tbody>
                                
                            </table>

                            <br></br>
                            <div className="">
                            <button type ="submit" className="btn btn-primary float-right col-3" style={{width:"100%"}}>Criar Lista</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </TemplateSistema>
        )
    }
}