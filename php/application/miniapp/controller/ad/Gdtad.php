<?php
namespace app\miniapp\controller\Ad;
use think\Db;
use think\Request;
use think\Config;

class Gdtad
{
	public function index()
	{
		return  "广点通广告" ;
	}	
    
	//点击广点通广告统计
	public function clickad(Request $request){
	$user_id =$request->param("user_id");//用户id
	if($user_id==0){
		$resdata=['state'   => '200','message'  => "官方审核人员没id不统计"];
		return $resdata;
	}
	$channel=$request->param("channel");//渠道
	$adtype=$request->param("adtype");//广告类型，1：banner，2：激励视频，3：格子，4：视频广告 5:模板广告，6：小盟广告
	$position=$request->param("position");//位置
	$time =date('Y-m-d H:i:s',time());//获取当前时间
	$adres = ['id'=>'','user_id' =>$user_id,'channel' =>$channel,'adtype' =>$adtype,'position' =>$position,'create_time' =>$time];
	$addata=db('click_gdt_ad')->insert($adres);
	$resdata=['state'   => '200','message'  => "统计广告成功"];
	return $resdata;
	}


	//广点通广告加载统计
	public function adload(Request $request){
	$user_id =$request->param("user_id");//用户id
	if($user_id==0){
		$resdata=['state'   => '200','message'  => "官方审核人员没id不统计"];
		return $resdata;
		}
	$channel=$request->param("channel");//渠道
	$adtype=$request->param("adtype");//广告类型，1：banner，2：激励视频，3：格子，4：视频广告 5:模板广告，6：小盟广告
	$position=$request->param("position");//位置
	$state=$request->param("state");//状态
	$time =date('Y-m-d H:i:s',time());//获取当前时间
	$adres = ['id'=>'','user_id' =>$user_id,'channel' =>$channel,'adtype' =>$adtype,'position' =>$position,'state' =>$state,'create_time' =>$time];
	$addata=db('gdt_ad_load')->insert($adres);
	$resdata=['state'   => '200','message'  => "广告加载统计成功"];
	return $resdata;
    }


	public function test(Request $request){
		//     	// 获取当日的数据
		// Db::table('table') ->whereTime('times', 'today')->select();
		// // 获取昨天的数据
		// Db::table('table')->whereTime('times', 'yesterday')->select();
		// // 获取本周的数据
		// Db::table('table')->whereTime('times', 'week')->select();   
		// // 获取上周的数据
		// Db::table('table')->whereTime('times', 'last week')->select();    
		// // 获取本月的数据
		// Db::table('table')->whereTime('times', 'month')->select();   
		// // 获取上月的数据
		// Db::table('table')->whereTime('times', 'last month')->select();      
		// // 获取今年的数据
		// Db::table('table')->whereTime('times', 'year')->select();    
		// // 获取去年的数据
		// Db::table('table')->whereTime('times', 'last year')->select();  
    }

    
    
}
