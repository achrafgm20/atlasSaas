
import AdminChart1 from '@/page/adminPage/components/AdminChart1'
import CardUi from '../components/CardUi';
import AdminGain from '../components/AdminGain';



export default function Dashboard() {
  

  return (
    <div>
      <h1 className='text-4xl font-bold p-4'>Dashboard Overview</h1>
       <p className='px-4'>Welcome back! Here's what's happening with your platform today.</p>
      <CardUi />
      <AdminChart1 />
      <AdminGain />
    </div>
  );
}
