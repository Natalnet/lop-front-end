import React from 'react'
import imgLoading1 from '../../../assets/loading1.gif'

export default (props) =>{
	const {changeLanguage,changeTheme,executar,loadingReponse} = props
	return(
          <div className="form-row">
            <div className="form-group col-md-3">
              <select className="form-control" onChange={changeLanguage}>
                <option value = 'javascript'>JavaScript</option>
                <option value = 'c_cpp'>C++</option>
              </select>
             </div>
            <div className="form-group col-md-3">
              <select className="form-control" onChange={changeTheme}>
                <option value = 'vs-dark'>Visual Studio Dark</option>
                <option value = 'hc-black'>High Contrast Dark</option>
                <option value = 'vs'>Visual Studio</option>
              </select>
            </div>
            <div className="form-group col-md-3">
                <button className={`btn btn-primary ${loadingReponse && 'btn-loading'}`} onClick={executar}>
                  Executar
                </button>
            </div>
          </div>

	)
}