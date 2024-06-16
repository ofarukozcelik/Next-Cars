import Card from "./(components)/Card";
import { headers } from "next/headers";
import Link from "next/link";
import { IoCarSportOutline } from "react-icons/io5";


const host = headers().get("host");
const protocol = headers().get("x-forwarded-proto");
export const baseUrl = `${protocol}://${host}`;

const getData = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/vehicles`);

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-bold text-md">
        <p className="header gap-7 items-center">
          <IoCarSportOutline color="#EF4444" font size="35px" />
          NEXT CARS
          <IoCarSportOutline color="#EF4444" size="35px" />
        </p>
      </div>
      {/* ürünler */}
      <div className="container">
        {data?.data.map((vehicle) => (
          <Card vehicle={vehicle} key={vehicle._id} baseUrl={baseUrl} />
        ))}
      </div>

      {/* footer */}
      <footer className="fixed flex-col bottom-0 w-full flex items-center justify-center bg-gradient-to-t from-black via-black h-20">
        <Link className="p-1 font-bold hover:text-gray-400 transition" href="/orders">
          Siparişlerim
        </Link>
        <span className="h-[2px] mb-1 w-1/6 bg-red-500 rounded-full" />
        <span className="h-[2px] mb-1 w-1/5 bg-red-500 rounded-full" />
      </footer>
    </main>
  );
}
