<?php
namespace app\miniapp\controller\Article;
use think\Db;
use think\Request;
use think\Config;

class Articles
{

   //文章列表查询成功
   public function lists(Request $request){
    $pages=$request->param("pages");
    $search=$request->param("search");
    if($pages == 1 || $pages==null  ){
      $number=0;
    }
    else{
      $number=($pages - 1)*10 ;
    }
    if($search ==null){//搜索不存在
      $countnumber=db('articles')->where('switch',0)->count();
      $data=db('articles')->where('switch',0)->order('id desc')->limit($number,10)->select();
    }
    else{
      $where['title'] = array('like','%'.$search.'%');
      $countnumber=db('articles')->where('switch',0)->where($where)->count();
      $data=db('articles')->where('switch',0)->where($where)->order('id desc')->limit($number,10)->select();
    }


    $state=['state'   => '200','message'  => "文章列表查询成功" ];
    $resdata=array_merge($state,array('count'=>$countnumber),array('data'=>$data));
    return $resdata ;
  }

  //最新发布，查询最新发布的20条
  public function newlists(Request $request){
   $data=db('articles')->where('switch',0)->order('create_time desc')->limit(0,20)->select();
   $state=['state'   => '200','message'  => "最新发布，查询最新发布的20条文章" ];
   $resdata=array_merge($state,array('data'=>$data));
   return $resdata ;
   }


//查询最热门的20条
  public function hotelists(Request $request){
   $data=db('articles')->where('switch',0)->order('seenum desc')->limit(0,20)->select();
   $state=['state'   => '200','message'  => "查询最热门的20条" ];
   $resdata=array_merge($state,array('data'=>$data));
   return $resdata ;
   }




}
