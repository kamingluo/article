<?php
namespace app\miniapp\controller\Article;
use think\Db;
use think\Request;
use think\Config;

class Userarticles
{

   //用户文章记录
   public function statistics(Request $request){
   
      $user_id =$request->param("user_id");//用户id
      $article_id =$request->param("article_id");//文章id
      $openid=$request->param("openid");//用户openid
      $type=$request->param("type");//记录类型：0观看1转发2点赞
      $time =date('Y-m-d H:i:s',time());//获取当前时间
      if($user_id==0){
        $resdata=['state'   => '200','message'  => "官方审核人员没id不统计"];
        return $resdata;
      }
      $record=db('user_articles_record')->where('user_id',$user_id)->where('article_id',$article_id)->where('type',$type)->find();//查询用户是否记录过这文章

      if($record==null){
        $adres = ['id'=>'','user_id' =>$user_id,'article_id' =>$article_id,'openid' =>$openid,'type' =>$type,'create_time' =>$time,'update_time' =>$update_time];
        $addata=db('user_articles_record')->insert($adres);
        $resdata=['state'   => '200','message'  => "统计用户观看文章记录成功"];
        return $resdata;
      }
      else{
        $dbreturn= db('user_articles_record')->where('user_id',$user_id)->where('article_id',$article_id)->update(['update_time' => $time]);
        $state=['state'   => '200','message'  => "用户观看文章记录更新成功"];
        return $state;

      }
  }

  //用户文章记录
  public function record(Request $request){
   $user_id =$request->param("user_id");//用户id
   $pages =$request->param("pages");//类型
   $type =$request->param("type");//记录类型：0观看1转发2点赞
   //Db::field('articles.*')->table(['articles'=>'id','user_articles_record'=>'article_id'])->where('articles.switch=0')->limit($number,10)->select();//多表联合查询
   if(!$pages){
       $pages=1;
   }
   if(!$type){
       $type=1;
   }
   $endnumber=$pages*10 ; //结束查询条数
   $startnumber=$endnumber -10;//开始查询条数
   $sql = "select articles.*,user_articles_record.openid from articles,user_articles_record where user_articles_record.article_id=articles.id and user_articles_record.type = ".$type."  and articles.switch = 0 and user_articles_record.user_id = ".$user_id." order BY user_articles_record.update_time desc LIMIT ".$startnumber.",10;";
   $datalist = Db::query($sql); //拿到数据
   //  $countsql="select count(*) as count from articles,user_articles_record where user_articles_record.article_id=articles.id and articles.switch = 0 and user_articles_record.user_id = ".$user_id.";";
   //  $count =Db::query($countsql); //拿到数据

   $count =Db::field('articles.*')->table(['articles'=>'id','user_articles_record'=>'article_id'])->where('articles.switch',0)->where('user_articles_record.type',$type)->where('user_articles_record.user_id',$user_id)->count();//多表联合查询
   $state=['state'   => '200','message'  => "查询用户观看记录成功",'count'=>$count ];
   $resdata=array_merge($state,array('datalist'=>$datalist));
   return $resdata ;

   }


}
