import React, { useEffect, useState, useCallback } from "react";
import { Card, CardBody, CardHead } from '../ui/card';
import { Row, Col } from '../ui/grid';
import useUser from '../../hooks/useUser';
import { Load } from '../ui/load'
import Switch from '@material-ui/core/Switch';
const ProfileSubscreen = () => {

    const { user, isLoadingUser, isSavingUser, errUpdateProfileUser, getInfoProfileUser, updateInfoProfileUser } = useUser();
    const [name, setName] = useState('');
    const [editPassowrd, setEditPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        getInfoProfileUser();
    }, []);

    useEffect(() => {
        user && setName(user.name);
    }, [user]);

    const handleUpdateProfile = useCallback(() => {
        const userData = {
            name,
            currentPassword,
            newPassword,
            confirmNewPassword
        }
        updateInfoProfileUser(userData, editPassowrd);
    }, [name, currentPassword, newPassword, confirmNewPassword, editPassowrd, updateInfoProfileUser]);

    if (isLoadingUser || !user) {
        return <Load />
    }

    return (
        <Card>
            <CardHead>Perfil</CardHead>
            <CardBody>
                <Row className='mb-4'>
                    <Col className='col-12 col-sm-6 col-md-4'>
                        <div className="form-group">
                            <label>Nome: </label>
                            <input
                                type="text"
                                onChange={e => setName(e.target.value)}
                                className={`form-control ${errUpdateProfileUser.name && 'is-invalid'}`}
                                placeholder="Nome"
                                value={name}
                                required
                            />
                            <div className="invalid-feedback">{errUpdateProfileUser.name}</div>
                        </div>
                    </Col>
                    <Col className='col-12 col-sm-6 col-md-4'>
                        <div className="form-group">
                            <label>Email: </label>
                            <input
                                type="text"
                                className={`form-control`}
                                value={user.email}
                                readOnly
                            />
                        </div>
                    </Col>
                    <Col className='col-12 col-sm-6 col-md-4'>
                        <div className="form-group">
                            <label>Perfil: </label>
                            <input
                                type="text"
                                className={`form-control`}
                                value={user.profile}
                                readOnly
                            />
                        </div>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col className='col-12'>
                        <label className={`${!editPassowrd && 'text-secondary'}`}>Editar Senha: </label>
                        <Switch
                            checked={editPassowrd}
                            value={editPassowrd}
                            onChange={(e) => setEditPassword(e.target.checked)}
                            color="primary"
                            name="check"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </Col>
                </Row>
                {editPassowrd && (
                    <Row className='mb-4'>
                        <Col className='col-12 col-sm-6 col-md-4'>
                            <div className="form-group">
                                <label>Senha atual: </label>
                                <input
                                    type="password"
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className={`form-control ${errUpdateProfileUser.currentPassowrd && 'is-invalid'}`}
                                    placeholder="Senha"
                                    value={currentPassword}

                                />
                                <div className="invalid-feedback">{errUpdateProfileUser.currentPassowrd}</div>
                            </div>
                        </Col>
                        <Col className='col-12 col-sm-6 col-md-4'>
                            <div className="form-group">
                                <label>Nova senha: </label>
                                <input
                                    type="password"
                                    onChange={e => setNewPassword(e.target.value)}
                                    className={`form-control ${errUpdateProfileUser.confirmNewPassword  && 'is-invalid'}`}
                                    placeholder="Nova senha"
                                    value={newPassword}

                                />
                                <div className="invalid-feedback">{errUpdateProfileUser.confirmNewPassword}</div>

                            </div>
                        </Col>
                        <Col className='col-12 col-sm-6 col-md-4'>
                            <div className="form-group">
                                <label>Confirmação da nova senha: </label>
                                <input
                                    type="password"
                                    onChange={e => setConfirmNewPassword(e.target.value)}
                                    className={`form-control ${errUpdateProfileUser.confirmNewPassword && 'is-invalid'}`}
                                    placeholder="Confirmação da nova senha"
                                    value={confirmNewPassword}
                                />
                                <div className="invalid-feedback">{errUpdateProfileUser.confirmNewPassword}</div>
                            </div>
                        </Col>
                    </Row>
                )}
                <Row className='mb-4'>
                    <Col className='col-12'>
                        <button
                            type="button"
                            onClick={handleUpdateProfile}
                            disabled={!name}
                            className={`btn btn-primary btn-block ${isSavingUser && "btn-loading"}`}
                        >
                            Salvar
                        </button>
                    </Col>
                </Row>
            </CardBody>
        </Card >
    )
}

export default ProfileSubscreen;