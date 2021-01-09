<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;

class Banner
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
      $countnumber=db('banner')->count();
      $data=db('banner')->order('id desc')->limit($number,10)->select();
    }
    else{
      $where['title'] = array('like','%'.$search.'%');
      $countnumber=db('banner')->where($where)->count();
      $data=db('banner')->where($where)->order('id desc')->limit($number,10)->select();
    }


    $state=['state'   => '200','message'  => "首页轮播图列表查询成功" ];
    $resdata=array_merge($state,array('count'=>$countnumber),array('data'=>$data));
    return $resdata ;
  }


  //删除文章
	public function delete(Request $request)
  {
    	  $data=db('banner')-> where('id', $request->param("id"))->delete();
        $state=['state'   => '200','message'  => "首页轮播图删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
  }

    //详情
	public function details(Request $request)
  {
       
        $data=db('banner')-> where('id', $request->param("id"))->find();
        $state=['state'   => '200','message'  => "banner详情" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
  }

    //修改banner状态
    public function modifystate(Request $request)
    {
      $id=$request->param("id");
      $switch=$request->param("switch");
      $time =date('Y-m-d H:i:s',time());//获取当前时间
      $dbreturn= db('banner')->where('id',$id)->update(['switch' =>$switch,'update_time' =>$time]);
      return ['state'   => '200','message'  => "修改banner状态成功"] ;
    }



  //新增或者修改文章
  public function add(Request $request)
  {
    	$id=$request->param("id");
    	$title=$request->param("title");
      $image=$request->param("image");
      $jumpurl=$request->param("jumpurl");
      $seenum=$request->param("seenum");
      $switch=$request->param("switch");
      $type=$request->param("type");
      $time =date('Y-m-d H:i:s',time());//获取当前时间
    	if($id){
    		$dbreturn= db('banner')->where('id',$id)->update(['title' =>$title,'image' =>$image,'jumpurl' =>$jumpurl,'seenum' =>$seenum,'switch' =>$switch,'type' =>$type,'update_time' =>$time]);
    		return ['state'   => '200','message'  => "更新轮播图成功"] ;
 
    	}else{

        $dbdata = ['title' =>$title,'image' =>$image,'jumpurl' =>$jumpurl,'seenum' =>$seenum,'switch' =>$switch,'type' =>$type,'create_time' =>$time,'update_time' =>$time];
        $dbreturn=db('banner')->insert($dbdata);
        return ['state'   => '200','message'  => "添加轮播图成功"] ;
    	}
  } 
}
