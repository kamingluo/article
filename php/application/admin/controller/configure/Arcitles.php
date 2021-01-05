<?php
namespace app\admin\controller\configure;
use think\Db;
use think\Request;
use think\Config;

class Arcitles
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
      $countnumber=db('articles')->count();
      $data=db('articles')->order('id desc')->limit($number,10)->select();
    }
    else{
      $where['title'] = array('like','%'.$search.'%');
      $countnumber=db('articles')->where($where)->count();
      $data=db('articles')->where($where)->order('id desc')->limit($number,10)->select();
    }


    $state=['state'   => '200','message'  => "文章列表查询成功" ];
    $resdata=array_merge($state,array('count'=>$countnumber),array('data'=>$data));
    return $resdata ;
  }


  //删除文章
	public function delete(Request $request)
  {
    	  $data=db('articles')-> where('id', $request->param("id"))->delete();
        $state=['state'   => '200','message'  => "文章删除成功" ];
        $resdata=array_merge($state,array('data'=>$data));
        return $resdata ;
  }

  //修改文章状态
  public function modifystate(Request $request)
  {
    $id=$request->param("id");
    $switch=$request->param("switch");
    $time =date('Y-m-d H:i:s',time());//获取当前时间
    $dbreturn= db('articles')->where('id',$id)->update(['switch' =>$switch,'update_time' =>$time]);
    return ['state'   => '200','message'  => "修改文章状态成功"] ;
  }



  //新增文章
  public function add(Request $request)
  {
    	$id=$request->param("id");
    	$title=$request->param("title");
      $image=$request->param("image");
      $jumpurl=$request->param("jumpurl");
      $seenum=$request->param("seenum");
      $switch=$request->param("switch");
      $time =date('Y-m-d H:i:s',time());//获取当前时间

    	if($id){
    		$dbreturn= db('articles')->where('id',$id)->update(['title' =>$title,'image' =>$image,'jumpurl' =>$jumpurl,'seenum' =>$seenum,'switch' =>$switch,'update_time' =>$time]);
    		return ['state'   => '200','message'  => "更新文章成功"] ;
 
    	}else{

        $dbdata = ['title' =>$title,'image' =>$image,'jumpurl' =>$jumpurl,'seenum' =>$seenum,'switch' =>$switch,'create_time' =>$time,'update_time' =>$time];
        $dbreturn=db('articles')->insert($dbdata);
        return ['state'   => '200','message'  => "添加文章成功"] ;
    	}
  } 
}
