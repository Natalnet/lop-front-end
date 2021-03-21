import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "src/contexts/authContext";
import profileImg from "../../../assets/perfil.png"
const HeadPefilMenu = () => {

  const history = useHistory();
  const { user: { profile, name, urlImage }, isLoged, handleLogout } = useContext(AuthContext);

  useEffect(()=>{
    if(!isLoged){
      history.push('/');
    }
  },[isLoged, history]);
  return (
    <div className="d-flex">
      <Link className="header-brand" to={`/${profile && profile.toLocaleLowerCase()}`}>
        <img
          src="/assets/images/lop.svg"
          className="header-brand-img"
          alt="lop logo"
        />
      </Link>
      <div className="d-flex order-lg-2 ml-auto">
        <div className="dropdown">
          <Link
            to="#"
            className="nav-link pr-2 leading-none"
            data-toggle="dropdown"
          >
            <span
              className="avatar"
              style={{
                backgroundImage: `url(${urlImage || profileImg})`
              }}
            />
            <span className="ml-2 d-none d-lg-block">
              <span className="text-default">{name}</span>
              <small className="text-muted d-block mt-1">
                {profile && profile.toUpperCase()}
              </small>
            </span>
          </Link>
          <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
            <Link className="dropdown-item" to={`/${profile}/perfil`}>
              <i className="dropdown-icon fe fe-user" /> Perfil
              </Link>
            <div className="dropdown-divider" />
            <button
              className="dropdown-item"
              style={{
                cursor: 'pointer'
              }}
              onClick={handleLogout}
            >
              <i className="dropdown-icon fe fe-log-out" /> Sair
              </button>
          </div>
        </div>
      </div>
      <Link
        to="#"
        className="header-toggler d-lg-none ml-3 ml-lg-0"
        data-toggle="collapse"
        data-target="#headerMenuCollapse"
      >
        <span className="header-toggler-icon" />
      </Link>
    </div>
  );
}

export default HeadPefilMenu;