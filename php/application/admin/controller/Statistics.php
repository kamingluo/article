<?php


namespace app\admin\controller;
use think\Db;
use think\Request;
use think\Exception;
use think\Log;

class Statistics
{
   
    //统计前一天的相关数据，一般是凌晨执行
    public function statistics()
    {

        set_time_limit(0);//设置超时时间
        $registerusers=db('user')->whereTime('create_time', 'today')->count();//今天注册用户数
        $activeusers=db('user')->whereTime('update_time', 'today')->count();//今天活跃用户数


        $clickbanner=db('click_gdt_ad')->where('adtype',1)->whereTime('create_time', 'today')->count();//今日点击banner数
        $seevideo=db('click_gdt_ad')->where('adtype',2)->whereTime('create_time', 'today')->count();//今日观看完成视频数
        $clickgrid=db('click_gdt_ad')->where('adtype',3)->whereTime('create_time', 'today')->count();//今日点击格子广告数
        $clickvideo=db('click_gdt_ad')->where('adtype',4)->whereTime('create_time', 'today')->count();//今日点击视频广告数
        $clickcustom=db('click_gdt_ad')->where('adtype',5)->whereTime('create_time', 'today')->count();//今日点击模板广告数
        $clickxmad=db('click_gdt_ad')->where('adtype',6)->whereTime('create_time', 'today')->count();//今日点击小盟广告数

        $data = ['registerusers' =>$registerusers,'activeusers'=>$activeusers,'clickbanner'=>$clickbanner,'seevideo'=>$seevideo,'clickgrid'=>$clickgrid,'clickvideo'=>$clickvideo,'clickcustom'=>$clickcustom,'clickxmad'=>$clickxmad];
        $state=['state'   => '200','message'  => "常规数据" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata;


    }
   

}
