import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";

import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";

const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class HomeListasScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            listas: [],
            loadingListas:false,
            fildFilter:'title',
            contentInputSeach:'',
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)

    }

    componentDidMount() {
        this.getListas();
    }

    async getListas(){
        const {numPageAtual,contentInputSeach,fildFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&fild=${fildFilter}`
        console.log(query);

        try{
            this.setState({loadingListas:true})
            const response = await api.get(`/listQuestion/page/${numPageAtual}?${query}`)
            this.setState({
                listas : response.data.docs,
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingListas:false
            })
        }catch(err){
            this.setState({loadingListas:false})
            console.log(err);
        }
    };
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getListas())
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
        },()=>this.getListas())
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        },()=>this.getListas())
        
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getListas())
        
    }


    render() {
        const {listas,fildFilter,loadingListas,contentInputSeach,numPageAtual,totalPages,perfil} = this.state
        return (
        <TemplateSistema active='listas'>
            <div>
                <h1 styler={titulo}>Listas de Exercicios</h1><br></br>
                <div className="row">
                    <div className="col-3">
                        <div>
                            <Link to="/professor/criarlista" className="nav-link">
                            <button 
                                className="btn btn-primary"
                                type="button"
                                style={botao}
                            >
                                Criar Lista+
                            </button>
                            </Link>
                        </div>
                    </div>

                    <div className="input-group mb-3 col-9">

                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder={`Perquise pelo ${fildFilter==='title'?'Nome':fildFilter==='code'?'Código':'...'}`} 
                            aria-label="Recipient's username" 
                            aria-describedby="button-addon2"
                            value={contentInputSeach}
                            onChange={(e) => this.handleContentInputSeach(e)}
                        />
                         <div className="selectgroup">
                            <select onChange={(e)=>this.handleSelectfildFilter(e)} className="selectize-input items has-options full has-items form-control">
                              <option value='title'>Nome</option>
                              <option value='code'>Código</option>
                            </select>
                                
                        </div>
                  
                        <button 
                            className={`btn btn-secondary btn-outline-secondary ${loadingListas && 'btn-loading'}`}                            type="button" 
                            id="button-addon2"
                            onClick={()=> this.clearContentInputSeach()}
                        >
                            <i className="fe fe-rotate-cw" />
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12">
                        <table style={lista} className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>Data de criação</th>
                                    <th className="text-center">Ver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingListas
                                ?
                                    <tr>
                                        <td>
                                            <div className="loader" />
                                        </td>
                                        <td>                                        
                                            <div className="loader" />
                                        </td>
                                        <td>
                                            <div className="loader"/>
                                        </td>                                        
                                        <td>
                                            <div className="loader"/>
                                        </td>
                                    </tr>
                                :
                                    listas.map((lista, index) => {
                                    let ano = new Date(lista.createdAt).getFullYear()
                                    let mes = new Date(lista.createdAt).getMonth()+1
                                    let dia = new Date(lista.createdAt).getDate()
                                    let hora = new Date(lista.createdAt).getHours()
                                    let minuto = new Date(lista.createdAt).getMinutes()
                                    let segundo = new Date(lista.createdAt).getSeconds()
                                    mes = mes<10?'0'+mes:mes
                                    dia = dia<10?'0'+dia:dia
                                    hora = hora<10?'0'+hora:hora
                                    minuto = minuto<10?'0'+minuto:minuto
                                    segundo = segundo<10?'0'+segundo:segundo
                                    let date = `${dia}/${mes}/${ano} - ${hora}:${minuto}`
                                    return (
                                        <tr key={index}>
                                            <td>{lista.title}</td>
                                            <td>{lista.code}</td>
                                            <td>{date}</td>
                                            <td className="text-center">
                                                <button className="btn btn-primary float-right" type="submit"><i className="fa fa-info" /></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 text-center'>
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </div>
                </div>
            </div>
        </TemplateSistema>
        )
    }
}