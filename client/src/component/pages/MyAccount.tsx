import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { ProfileSettingsTab, SettingsTabs } from "../../types/layout";
import Display from "../layout/account-tabs/Display";

const tabs: SettingsTabs = {
    "Display": ProfileSettingsTab.DISPLAY,
    "Security": ProfileSettingsTab.SECURITY,
    "Privacy": ProfileSettingsTab.PRIVACY,
}

export default function MyAccount() {
    const [tab, setTab] = useState(ProfileSettingsTab.DISPLAY);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-row justify-center items-start mt-20 gap-6"
        >
            <div className="container w-[50rem] flex flex-row items-start justify-start py-3 pl-3">
                <div className="h-[30rem] bg-[var(--night)] w-1/4 flex flex-col justify-start items-center">
                    {Object.keys(tabs).map((key, i) => (
                        <p
                            key={i}
                            onClick={() => {
                                if (tab == tabs[key]) {
                                    return;
                                }
                                setTab(tabs[key])
                            }}
                            className={`w-full text-center py-3 cursor-pointer text-xl 
                                font-bold transition-colors duration-300 ${tab == tabs[key] ? "text-[var(--blue-violet)]" : ""}
                                hover:bg-[var(--dark-jet)]`}
                        >
                            {key}
                        </p>
                    ))}
                </div>
                <div className="pl-5">
                    {tab == ProfileSettingsTab.DISPLAY && (
                        <Display />
                    )}
                </div>
            </div>
        </motion.div>
    )
}
