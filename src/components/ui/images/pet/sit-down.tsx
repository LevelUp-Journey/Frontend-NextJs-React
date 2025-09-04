import Image, { ImageProps } from "next/image";
import SitDownPetImage from "@/../public/pet/sit-down.png";

export default function SitDownAppPet({
    width = 100,
    height = 100,
    ...props
}: Omit<ImageProps, "src">) {
    return (
        <Image
            {...props}
            src={SitDownPetImage}
            alt={"Sit Down Pet"}
            width={width}
            height={height}
        />
    );
}
