import React from 'react'
import imgLoading1 from '../../../assets/loading1.gif'

export default (props) =>{
	const {changeLanguage,changeTheme,executar,loadingReponse} = props
	const themes = ['monokai','github','tomorrow','kuroir','twilight','xcode','textmate','solarized_dark','solarized_light','terminal']
  return(
          <div className="form-row">
            <div className="form-group col-md-3">
              <select className="form-control" onChange={changeLanguage}>
                <option value = 'javascript'>JavaScript</option>
                <option value = 'c_cpp'>C++</option>
              </select>
             </div>
            <div className="form-group col-md-3">
              <select defaultValue='monokai' className="form-control" onChange={changeTheme}>
                {
                  themes.map(thene=>(
                    <option key={thene} value ={thene}>{thene}</option>
                  ))
                }
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