import React, { Component,Fragment } from "react";
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";

import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import Modal from 'react-bootstrap/Modal';
import BotaoModal from "components/ui/modal/btnModalLista.component"
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import formataData from "../../../util/funçoesAuxiliares/formataData";


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
            showModal:false,
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
        document.title = "Listas - professor";
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
            console.log('listas');
            console.log(response.data.docs);
            this.setState({
                listas : [...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingListas:false
            })
        }catch(err){
            this.setState({loadingListas:false})
            console.log(err);
        }
    };
    handleShowModal(){
        this.setState({showModal:true})
    }
    handleCloseModal(){
        this.setState({showModal:false})
    }
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
        }/*,()=>this.getListas()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getListas()*/)
    }
    filterSeash(){
        this.getListas()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getListas())
        
    }


    render() {
        const {listas,showModal,fildFilter,loadingListas,contentInputSeach,numPageAtual,totalPages,perfil} = this.state
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
                                Criar Lista <i className="fe fe-file-plus" />
                            </button>
                            </Link>
                        </div>
                    </div>
                    <div className="mb-3 col-9">     
                        <InputGroup
                            placeholder={`Perquise pelo ${fildFilter==='title'?'Nome':fildFilter==='code'?'Código':'...'}`}
                            value={contentInputSeach}
                            handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                            filterSeash={this.filterSeash.bind(this)}
                            handleSelect={this.handleSelectfildFilter.bind(this)}
                            options={ [{value:'title',content:'Nome'},{value:'code',content:'Código'}] }
                            clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                            loading={loadingListas}                            
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12">
                        <table style={lista} className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>Criado em</th>
                                    <th className="text-center"></th>
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
                                    return (
                                    <Fragment>
                                        <tr key={index}>
                                            <td>{lista.title}</td>
                                            <td>{lista.code}</td>
                                            <td>{formataData(lista.createdAt)}</td>
                                            <td className="text-center">
                                            <BotaoModal
                                                lista={lista}
                                            />                                             
                                            </td>
                                        </tr>
                                        
                                    </Fragment>
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