import "./Display.scss";
import Bio from "./display/Bio";
import ProfilePreview from "./display/ProfilePreview";

export default function Display() {
    return (
        <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold">Profile</h1>
            <ProfilePreview />
            <Bio />
        </div>
    )
}

