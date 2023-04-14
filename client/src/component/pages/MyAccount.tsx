import { motion } from "framer-motion";
import { useState } from "react";
import { ProfileSettingsTab, SettingsTabs } from "../../types/layout";
import SectionHeader from "../extras/SectionHeader";
import Display from "../layout/account-tabs/Display";

const tabs: SettingsTabs = {
    "Profile": ProfileSettingsTab.PROFILE,
    "Security": ProfileSettingsTab.SECURITY,
    "Privacy": ProfileSettingsTab.PRIVACY,
}

export default function MyAccount() {
    const [tab, setTab] = useState(ProfileSettingsTab.PROFILE);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-start items-center mt-20 gap-6"
        >
            <SectionHeader className="w-[50rem]" headerText="Account Settings" />
            <div className="container w-[50rem] flex flex-row items-start justify-start py-3 pl-3">
                <div className="h-full bg-[var(--night)] outset-shadow w-1/4 flex flex-col justify-start items-center">
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
                <div className="px-5 w-3/4">
                    {tab == ProfileSettingsTab.PROFILE && (
                        <Display />
                    )}
                </div>
            </div>
        </motion.div>
    )
}
