import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super();
    this.state = { error: null, 
      errorInfo: null 
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info
    });
    document.title = "Error 500 - Plataforma LOP";
  }

  recarregarPagina = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <div className="page-content">
            <div className="container text-center">
              <div className="display-1 text-muted mb-5">
                <i className="si si-exclamation" /> 500
              </div>
              <h1 className="h2 mb-3">
                Ops! Você acabou de encontrar uma página de erro.
              </h1>
              <p className="h4 text-muted font-weight-normal mb-7">
                Lamentamos, mas sua solicitação contém uma sintaxe incorreta e
                não pode ser atendida
              </p>
              <button className="btn btn-primary" onClick={()=>{this.recarregarPagina()}}>
                <i className="fe fe-rotate-cw mr-2" />
                Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
