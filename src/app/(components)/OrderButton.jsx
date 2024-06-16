"use client";

import { useState } from "react";
import Loader from "./Loader";

const OrderButton = ({ vehicle, baseUrl }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);

            //1) Ödeme linki için istek atıyoruz.
        fetch(`${baseUrl}/api/checkout`, {
            method: "POST",
            body: JSON.stringify(vehicle),
        })
            //2) Satın alma sayfası linkini alıyoruz.
            .then((res) => res.json())

            //3) Satın alma sayfasına yönlendiriyoruz.
            .then((data) => {
                window.location.href = data.url;
            })
            //4) Yükleme state'ini fale yap.
            .finally(() => setIsLoading(false));
    };

    return (
        <button
            disabled={isLoading}
            onClick={handleClick}
            className="bg-black text-center border py-1 px-3 w-full rounded-md text-sm cursor-pointer transition hover:bg-[#EF4444]"
        >
            {isLoading ? <Loader /> : "Sipariş Et"}
        </button>
    );
};

export default OrderButton;
