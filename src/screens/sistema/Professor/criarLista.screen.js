import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import Collapse from 'components/ui/collapse/collapseCriarLista.component'
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
export default class CriarListaScreen extends Component {
    state = {
        redirect: false,
        items: [],
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

    render() {
        if(this.state.perfil!=="PROFESSOR"){
            return <Redirect to="/401" />;
        }
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
                                    className="form-control col-9" 
                                    placeholder="Titulo da lista"
                                />

                                <div className="col-3">
                                    <select 
                                        className="form-control" 
                                    >
                                        <option>selecione....</option>
                                        <option>EXERCICIO</option>
                                        <option>PROVA</option>
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            <h4>Selecione as questões:</h4>
                            <br></br>
                            
                            {/*<Collapse
                                questoes={this.state.items}
                            />*/}

                            <br>{console.log(this.state.items)}</br>
                        </div>
                    </div>
                </form>
            </div>
        </TemplateSistema>
        )
    }
}