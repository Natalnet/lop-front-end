import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useDifficulty = () => {
    const [isSavingDifficulty, setIsSavingDifficulty] = useState(false);

    const saveDifficulty = useCallback(async ({ idQuestion, difficulty }) => {
        setIsSavingDifficulty(true);
        const request = {
            userDifficulty: difficulty,
            idQuestion
        }
        try {
            setIsSavingDifficulty(true);
            await api.post('/difficulty/store', request);
            setIsSavingDifficulty(false);
            return true;
        }
        catch (err) {
            Swal.fire({
                type: "error",
                title: "ops... erro ao salvar dificuldade",
            });
            setIsSavingDifficulty(false);
            return false;
        }
    }, []);

    return { isSavingDifficulty, saveDifficulty };
}

export default useDifficulty;