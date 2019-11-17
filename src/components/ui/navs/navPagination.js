import React from "react";
export default props => {
    const {pageAtual,handlePage,totalPages} = props
    let elementNavs = []
    for(let i=1;i<=totalPages;i++){
      elementNavs = [...elementNavs,
        <li key={i} className={`page-item ${i===pageAtual?'active':''}`}>
          <button className="page-link" onClick={(e)=>handlePage(e,i)}>
            {i}
          </button>
        </li>
      ]
    }
    return (
      <nav aria-label="...">
        <ul className="pagination pagination justify-content-center">
          <li className={`page-item ${pageAtual<=1?'disabled':''}`}>
            <button className="page-link" onClick={(e)=>handlePage(e,pageAtual-1)}>
              Anterior
            </button>
          </li>
          {elementNavs}
          <li className={`page-item ${pageAtual>=totalPages || totalPages===0?'disabled':''}`}>
            <button className="page-link" onClick={(e)=>handlePage(e,pageAtual+1)}>
              Próximo
            </button>
          </li>
        </ul>
      </nav>
    );
  }