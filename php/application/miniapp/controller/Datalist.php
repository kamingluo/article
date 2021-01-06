<?php
namespace app\miniapp\controller;
use think\Db;
use think\Request;
use think\Config;

class Datalist
{

   //首页banner查询
   public function banner(Request $request){
    $pages=$request->param("pages");
    $search=$request->param("search");
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10 ;
    }
    if($search ==null){
      $countnumber=db('banner')->where('switch',0)->count();
      $data=db('banner')->where('switch',0)->order('id desc')->limit($number,10)->select();
    }
    else{
      $where['title'] = array('like','%'.$search.'%');
      $countnumber=db('banner')->where('switch',0)->where($where)->count();
      $data=db('banner')->where('switch',0)->where($where)->order('id desc')->limit($number,10)->select();
    }
    $state=['state'   => '200','message'  => "banner列表查询成功" ];
    $resdata=array_merge($state,array('count'=>$countnumber),array('data'=>$data));
    return $resdata ;
  }

 

}
