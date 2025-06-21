import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
import Layout from '../../components/layout/Layout';
import { useContext, useState, useEffect } from 'react';
import myContext from '../../context/myContext';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem("users"));
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser } = context;
    const [totalItems, setTotalItems] = useState(0);


    useEffect(() => {
        if (getAllOrder.length > 0) {
            const itemCount = getAllOrder.reduce((acc, order) => acc + order.cartItems.length, 0);
            setTotalItems(itemCount);
        }
    }, [getAllOrder]);

    return (
        <Layout>
            <div>
                {/* Top */}
                <div className="top mb-5 px-5 mt-5">
                    <div className=" bg-purple-50 py-5 border border-purple-100 rounded-lg">
                        <h1 className=" text-center text-2xl font-bold text-purple-500">Admin Dashboard</h1>
                    </div>
                </div>

                <div className="px-5">
                    {/* Mid  */}
                    <div className="mid mb-5">
                        {/* main  */}
                        <div className=" bg-purple-50 py-5 rounded-xl border border-purple-100">
                            {/* image  */}
                            <div className="flex justify-center">
                                <img src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" alt="" />
                            </div>
                            {/* text  */}
                            <div className="">
                                <h1 className=" text-center text-lg"><span className=" font-bold text-purple-500">Name: </span><span className='text-green-600'>{user?.name}</span></h1>
                                <h1 className=" text-center text-lg"><span className=" font-bold ">Email: </span>{user?.email}</h1>
                                <h1 className=" text-center text-lg"><span className=" font-bold">Date: </span> {user?.date}</h1>
                                <h1 className=" text-center text-lg"><span className=" font-bold text-purple-500">Role: </span> <span className="text-green-600">{user?.role?.toUpperCase()}</span></h1>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="">
                        <Tabs>
                            <TabList className="flex flex-wrap -m-4 text-center justify-center">
                                {/* Total Products */}
                                <Tab className="p-4 md:w-1/3 sm:w-1/2 w-full cursor-pointer">
                                    <div className=" border bg-purple-50 hover:bg-purple-100 transition border-purple-100 px-4 py-3 rounded-xl" >
                                        <div className="text-purple-500 w-12 h-12 mb-3 inline-block" >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={50}
                                                height={50}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-shopping-basket"
                                            >
                                                <path d="m5 11 4-7" />
                                                <path d="m19 11-4-7" />
                                                <path d="M2 11h20" />
                                                <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
                                                <path d="m9 11 1 9" />
                                                <path d="M4.5 15.5h15" />
                                                <path d="m15 11-1 9" />
                                            </svg>

                                        </div>
                                        <h2 className="title-font font-medium text-3xl text-purple-400 fonts1" >{getAllProduct.length}</h2>
                                        <p className=" text-purple-500  font-bold" >Total Products</p>
                                    </div>
                                </Tab>

                                {/* Total Order & Total Items  */}

                                <Tab className="p-4 md:w-1/3 sm:w-1/2 w-full cursor-pointer">
                                    <div className="border bg-purple-50 hover:bg-purple-100 transition border-purple-100 px-6 py-5 rounded-xl flex flex-row justify-between items-center gap-2">

                                        {/* Left: Total Orders */}
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="text-purple-500 w-12 h-12 mb-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={50}
                                                    height={50}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-list-ordered"
                                                >
                                                    <line x1={10} x2={21} y1={6} y2={6} />
                                                    <line x1={10} x2={21} y1={12} y2={12} />
                                                    <line x1={10} x2={21} y1={18} y2={18} />
                                                    <path d="M4 6h1v4" />
                                                    <path d="M4 10h2" />
                                                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-semibold text-purple-500">{getAllOrder.length}</h2>
                                            <p className="text-purple-500 font-bold">Total Orders</p>
                                        </div>

                                        {/* Right: Total Items */}
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="text-purple-500 w-12 h-12 mb-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={50}
                                                    height={50}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-package"
                                                >
                                                    <path d="M16.5 9.4 7.55 4.24" />
                                                    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.06a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.21a2 2 0 0 0 2 0l7-4.21a2 2 0 0 0 1-1.73Z" />
                                                    <path d="M3.3 7 12 12.01 20.7 7" />
                                                    <path d="M12 22V12" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-semibold text-purple-500">{totalItems}</h2>
                                            <p className="text-purple-500 font-bold">Total Items</p>
                                        </div>

                                    </div>
                                </Tab>


                                {/* Total User  */}
                                <Tab className="p-4 md:w-1/3 sm:w-1/2 w-full cursor-pointer">
                                    <div className=" border bg-purple-50 hover:bg-purple-100 transition border-purple-100 px-4 py-3 rounded-xl" >
                                        <div className="text-purple-500 w-12 h-12 mb-3 inline-block" >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={50}
                                                height={50}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-users"
                                            >
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                <circle cx={9} cy={7} r={4} />
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>

                                        </div>
                                        <h2 className="title-font font-medium text-3xl text-purple-400 fonts1" >{getAllUser.length}</h2>
                                        <p className=" text-purple-500  font-bold" >Total Userr</p>
                                    </div>
                                </Tab>
                            </TabList>

                            <TabPanel>
                                <ProductDetail />
                            </TabPanel>
                            <TabPanel>
                                <OrderDetail />
                            </TabPanel>
                            <TabPanel>
                                <UserDetail />
                            </TabPanel>

                        </Tabs>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;