import React from "react";
export default props => {
    const {pageAtual,handlePage,totalPages} = props
    let elementNavs = []
    for(let i=1;i<=totalPages;i++){
      elementNavs.push(
        <li key={i} className={`page-item ${i==pageAtual?'active':''}`}>
          <a className="page-link" onClick={(e)=>handlePage(e,i)} href="#">
            {i}
          </a>
        </li>
      )
    }
    return (
      <nav aria-label="...">
        <ul className="pagination pagination justify-content-center">
          <li className={`page-item ${pageAtual===1?'disabled':''}`}>
            <a className="page-link" onClick={(e)=>handlePage(e,pageAtual-1)} href="#">
              Anterior
            </a>
          </li>
          {elementNavs}
          <li className={`page-item ${pageAtual===totalPages?'disabled':''}`}>
            <a className="page-link" onClick={(e)=>handlePage(e,pageAtual+1)} href="#">
              Próximo
            </a>
          </li>
        </ul>
      </nav>
    );
  }