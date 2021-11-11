import {useAppDispatch, useAppSelector} from "../../store/hooks";
import React, {useState} from "react";
import {Box, Button, Container, IconButton, InputAdornment, Modal, TextField} from "@mui/material";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import axios from "axios";
import {setUser} from "../../store/user";
import {LoadingButton} from "@mui/lab";

interface State {
    name: string,
    password: string,
    passwordRepeat: string,
    showPassword: boolean
}

interface ErrorList {
    userExists: boolean;
    incorrectName: boolean;
    neqPasswords: boolean;
    noPassword: boolean;
    wrongPassword: boolean;
}

interface LoginOrRegisterProps {
    open: boolean;
    isRegister: boolean;
}

export default function LoginOrRegister(props: LoginOrRegisterProps) {
    const user = useAppSelector( state => state.user);
    const dispatch = useAppDispatch();

    const [isRegister, setRegister] = useState(props.isRegister);
    const [isAwait, setAwait] = useState(false);

    const [formState, setFormState] = useState<State>({
        name: '',
        password: '',
        passwordRepeat: '',
        showPassword: false
    });
    const [errors, setErrors] = useState<ErrorList >({
        userExists: false,
        incorrectName: false,
        neqPasswords: false,
        noPassword: false,
        wrongPassword: false
    });
    const [offButton, setOffButton] = useState(false);

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState,
            [prop]: event.target.value
        });
        setOffButton(false);
    };

    const handleClickShowPassword = () => {
        setFormState({
            ...formState,
            showPassword: !formState.showPassword,
        });
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSendButton = () => {
        if (offButton || isAwait) return;

        setErrors({
            userExists: false,
            incorrectName: false,
            neqPasswords: false,
            noPassword: false,
            wrongPassword: false
        })
        let willOfButton = false;

        if (isRegister && (formState.passwordRepeat != formState.password)) {
            setErrors({...errors, neqPasswords: true});
            willOfButton = true;

        }
        if (formState.password.length == 0) {
            setErrors({...errors,noPassword: true});
            willOfButton = true;
        }
        if (formState.name.length == 0) {
            setErrors({...errors, incorrectName: true});
            willOfButton = true;
        }
        if (willOfButton) {
            setOffButton(true);
        }

        if (!willOfButton) {
            setAwait(true);
            console.log({
                    username: formState.name,
                    password: formState.password
                })
            axios.get((isRegister? "/user/register" : "/user/login"),
            {
                params: {
                    username: formState.name,
                    password: formState.password
                }
            }).then((response) => {
                setAwait(false);
                dispatch(setUser({username: formState.name, password: formState.password}));
            }).catch((err) => {
                if (err.response.status == 404) {
                    setErrors({...errors, wrongPassword: true});
                } else if (err.response.data == "duplicate username") {
                    setErrors({...errors, userExists: true});
                } else if (err.response.data == "password incorrect") {
                    setErrors({...errors, wrongPassword: true});
                }
                setOffButton(true);
                setAwait(false);
            });
        }

    };

    const handleRegister = () => {
        setRegister(!isRegister);
        setOffButton(false);
    }

    const visibility = <InputAdornment position="end">
        <IconButton
            aria-label="Показать/Скрыть"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
        >
            {formState.showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
    </InputAdornment>;


    return (
        <Modal
        open={props.open}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        >
            <Container sx={{bgcolor:'#FFFFFF',  textAlign: 'center',
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                '& .MuiTextField-root': { m: 1}}}  maxWidth="xs">
                {isRegister ? <h1>Регистрация</h1> : <h1>Вход</h1>}
                <div>
                    <TextField
                        fullWidth
                        error={(errors.userExists && isRegister) || errors.incorrectName || errors.wrongPassword}
                        label="Имя пользователя"
                        helperText={
                            errors.userExists && isRegister ? "Имя уже используется" :
                                ( errors.incorrectName ? "Имя пусто" :
                                    (errors.wrongPassword ? "Неверное имя или пароль" : undefined))}
                        onChange={handleChange('name')}
                        value={formState.name}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        error={(errors.noPassword && isRegister) || errors.wrongPassword}
                        label="Пароль"
                        helperText={errors.noPassword ? "Введите пароль" : undefined}
                        onChange={handleChange('password')}
                        type={formState.showPassword ? 'text' : 'password'}
                        value={formState.password}
                        InputProps={{
                            endAdornment: visibility
                        }}
                    />
                </div>
                {isRegister ?
                    <div>
                        <TextField
                            fullWidth
                            error={errors.neqPasswords}
                            label="Повтор пароля"
                            helperText={errors.neqPasswords ? "Пароли не совпадают" : undefined}
                            onChange={handleChange('passwordRepeat')}
                            type={formState.showPassword ? 'text' : 'password'}
                            value={formState.passwordRepeat}
                            InputProps={{
                                endAdornment: visibility
                            }}
                        />
                    </div>
                : undefined}

                <div>
                    <LoadingButton loading={isAwait} disabled={offButton} variant="contained" onClick={handleSendButton}>
                        {isRegister ? "Зарегистрироваться": "Войти"}
                    </LoadingButton>
                </div>

                <Box sx={{textAlign: 'right', margin: "20px 5px"}}>
                    <Button onClick={handleRegister}>{isRegister ? "Есть аккаунт? Войти": "Зарегистрироваться"}</Button>
                </Box>
            </Container>
        </Modal>
    );
}
