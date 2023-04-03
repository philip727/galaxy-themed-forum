import { useAnimationControls } from 'framer-motion'
import { ChangeEvent } from 'react';
import './InputField.scss'

type Props = {
    placeholder?: string,
    name?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string,
}

export default function InputField({ placeholder, name, onChange, type}: Props) {
    const controls = useAnimationControls();
    


    return (
        <div className="w-96 h-12 bg-[var(--dark-jet)] flex flex-col">
            <input name={name} placeholder={placeholder} onChange={onChange} type={type} className="w-full h-full bg-[rgba(0,0,0,0)] px-4 input-field"/>
            <span className="bg-[var(--blue-violet)] h-[2px] w-full transition-colors duration-300"/>
        </div>
    )
}
